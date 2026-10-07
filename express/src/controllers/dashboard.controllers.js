import { Op, fn, col, literal } from 'sequelize';
import users from '../data/model/users.model.js';
import produit from '../data/model/produit.model.js';
import reservation from '../data/model/reservation.model.js';
import reservationDetail from '../data/model/reservationDetail.model.js';
import Salle from '../data/model/Salle.model.js';
import abonnement from '../data/model/abonnement.model.js';
import '../data/model/relation.model.js';

const rangeConfig = {
  day: { unit: 'hour', steps: 24, label: (date) => `${String(date.getHours()).padStart(2, '0')}h` },
  week: { unit: 'day', steps: 7, label: (date) => date.toLocaleDateString('fr-FR', { weekday: 'short' }) },
  month: { unit: 'day', steps: 30, label: (date) => date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) },
  year: { unit: 'month', steps: 12, label: (date) => date.toLocaleDateString('fr-FR', { month: 'short' }) }
};

const normalizeRange = (range) => (rangeConfig[range] ? range : 'week');

const addUnit = (date, unit, amount) => {
  const next = new Date(date);
  if (unit === 'hour') next.setHours(next.getHours() + amount);
  if (unit === 'day') next.setDate(next.getDate() + amount);
  if (unit === 'month') next.setMonth(next.getMonth() + amount);
  return next;
};

const startOfUnit = (date, unit) => {
  const start = new Date(date);
  if (unit === 'hour') start.setMinutes(0, 0, 0);
  if (unit === 'day') start.setHours(0, 0, 0, 0);
  if (unit === 'month') {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
  }
  return start;
};

const buildBuckets = (range) => {
  const config = rangeConfig[range];
  const current = startOfUnit(new Date(), config.unit);
  const first = addUnit(current, config.unit, -(config.steps - 1));

  return Array.from({ length: config.steps }, (_, index) => {
    const start = addUnit(first, config.unit, index);
    const end = addUnit(start, config.unit, 1);
    return {
      name: config.label(start),
      start,
      end,
      revenue: 0,
      orders: 0
    };
  });
};

const formatAmount = (value) => `${Number(value || 0).toLocaleString('fr-FR')} Ar`;

const buildTrend = (current, previous) => {
  if (!previous && !current) return { change: '0%', trend: 'up' };
  if (!previous) return { change: '+100%', trend: 'up' };
  const value = ((current - previous) / previous) * 100;
  return {
    change: `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`,
    trend: value >= 0 ? 'up' : 'down'
  };
};

const activityDate = (item) => item.createdAt || item.created_at || item.date_reservation || item.date_abonnement;

const timeAgo = (dateValue) => {
  const date = new Date(dateValue);
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return 'Il y a moins d’une minute';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  const days = Math.floor(hours / 24);
  return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
};

const orderCustomer = (order) => {
  const user = order.user || order.users;
  return user ? `${user.nom || ''} ${user.prenom || ''}`.trim() : 'Client inconnu';
};

const matchesSearch = (value, search) => {
  if (!search) return true;
  return value.toLowerCase().includes(search.toLowerCase());
};

export const getDashboardData = async (req, res) => {
  try {
    const range = normalizeRange(req.query.range);
    const search = String(req.query.search || '').trim();
    const buckets = buildBuckets(range);
    const periodStart = buckets[0].start;
    const previousStart = addUnit(periodStart, rangeConfig[range].unit, -rangeConfig[range].steps);

    const [
      totalRevenue,
      totalOrders,
      totalUsers,
      totalProducts,
      previousRevenue,
      previousOrders,
      previousUsers,
      previousProducts,
      chartReservations,
      popularRows,
      recentOrders,
      recentUsers,
      recentProducts,
      recentSalles,
      recentAbonnements
    ] = await Promise.all([
      reservation.sum('montant_total'),
      reservation.count(),
      users.count(),
      produit.count(),
      reservation.sum('montant_total', { where: { createdAt: { [Op.gte]: previousStart, [Op.lt]: periodStart } } }),
      reservation.count({ where: { createdAt: { [Op.gte]: previousStart, [Op.lt]: periodStart } } }),
      users.count({ where: { createdAt: { [Op.gte]: previousStart, [Op.lt]: periodStart } } }),
      produit.count({ where: { created_at: { [Op.gte]: previousStart, [Op.lt]: periodStart } } }),
      reservation.findAll({
        attributes: ['id', 'montant_total', 'createdAt'],
        where: { createdAt: { [Op.gte]: periodStart } },
        raw: true
      }),
      reservationDetail.findAll({
        attributes: [
          'produit_id',
          [fn('SUM', col('quantite')), 'sales'],
          [literal('SUM(`reservationDetail`.`quantite` * `reservationDetail`.`prix_unitaire`)'), 'revenue']
        ],
        include: [{ model: produit, as: 'produit', attributes: ['id', 'nom'] }],
        group: ['produit_id', 'produit.id', 'produit.nom'],
        order: [[literal('sales'), 'DESC']],
        limit: 8,
        raw: true,
        nest: true
      }),
      reservation.findAll({
        attributes: ['id', 'reference', 'montant_total', 'statut', 'date_reservation', 'createdAt'],
        include: [{ model: users, attributes: ['nom', 'prenom'] }],
        order: [['createdAt', 'DESC']],
        limit: 8
      }),
      users.findAll({ attributes: ['id', 'nom', 'prenom', 'createdAt'], order: [['createdAt', 'DESC']], limit: 5, raw: true }),
      produit.findAll({ attributes: ['id', 'nom', 'created_at'], order: [['created_at', 'DESC']], limit: 5, raw: true }),
      Salle.findAll({ attributes: ['id', 'nom', 'createdAt'], order: [['createdAt', 'DESC']], limit: 5, raw: true }),
      abonnement.findAll({
        attributes: ['id', 'date_abonnement', 'createdAt'],
        include: [{ model: Salle, as: 'salle', attributes: ['nom'] }],
        order: [['createdAt', 'DESC']],
        limit: 5
      })
    ]);

    chartReservations.forEach((order) => {
      const createdAt = new Date(order.createdAt);
      const bucket = buckets.find((item) => createdAt >= item.start && createdAt < item.end);
      if (bucket) {
        bucket.revenue += Number(order.montant_total || 0);
        bucket.orders += 1;
      }
    });

    const totalRevenueValue = Number(totalRevenue || 0);
    const topProducts = popularRows
      .map((row) => ({
        name: row.produit?.nom || 'Produit inconnu',
        sales: Number(row.sales || 0),
        revenue: Number(row.revenue || 0),
        trend: '+0%'
      }))
      .filter((item) => matchesSearch(`${item.name} ${item.sales}`, search))
      .slice(0, 4);

    const orders = recentOrders
      .map((order) => ({
        id: order.reference || `#ORD-${String(order.id).padStart(3, '0')}`,
        customer: orderCustomer(order),
        amount: formatAmount(order.montant_total),
        rawAmount: Number(order.montant_total || 0),
        status: order.statut === 'confirmee' ? 'completed' : order.statut === 'annulee' ? 'pending' : 'processing',
        date: new Date(order.date_reservation || order.createdAt).toLocaleDateString('fr-FR')
      }))
      .filter((item) => matchesSearch(`${item.id} ${item.customer} ${item.amount} ${item.date}`, search))
      .slice(0, 4);

    const activities = [
      ...recentOrders.map((order) => ({ type: 'order', title: `Nouvelle commande ${order.reference || `#ORD-${String(order.id).padStart(3, '0')}`}`, date: activityDate(order) })),
      ...recentUsers.map((user) => ({ type: 'user', title: `Nouvel utilisateur ${user.nom || ''} ${user.prenom || ''}`.trim(), date: activityDate(user) })),
      ...recentProducts.map((item) => ({ type: 'product', title: `Nouveau produit ${item.nom}`, date: activityDate(item) })),
      ...recentSalles.map((salle) => ({ type: 'salle', title: `Nouvelle salle de sport ${salle.nom}`, date: activityDate(salle) })),
      ...recentAbonnements.map((item) => ({ type: 'abonnement', title: `Nouvel abonnement ${item.salle?.nom || ''}`.trim(), date: activityDate(item) }))
    ]
      .filter((item) => item.date && matchesSearch(item.title, search))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6)
      .map((item) => ({ ...item, time: timeAgo(item.date) }));

    res.status(200).json({
      success: true,
      data: {
        stats: {
          revenue: { value: formatAmount(totalRevenueValue), rawValue: totalRevenueValue, ...buildTrend(totalRevenueValue, Number(previousRevenue || 0)) },
          orders: { value: Number(totalOrders || 0).toLocaleString('fr-FR'), rawValue: Number(totalOrders || 0), ...buildTrend(Number(totalOrders || 0), Number(previousOrders || 0)) },
          users: { value: Number(totalUsers || 0).toLocaleString('fr-FR'), rawValue: Number(totalUsers || 0), ...buildTrend(Number(totalUsers || 0), Number(previousUsers || 0)) },
          products: { value: Number(totalProducts || 0).toLocaleString('fr-FR'), rawValue: Number(totalProducts || 0), ...buildTrend(Number(totalProducts || 0), Number(previousProducts || 0)) }
        },
        chart: buckets.map(({ name, revenue, orders }) => ({ name, revenue, orders })),
        topProducts,
        recentOrders: orders,
        activities
      }
    });
  } catch (error) {
    console.error('Erreur getDashboardData:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const exportDashboardStats = async (req, res) => {
  try {
    const range = normalizeRange(req.query.range);
    const fakeReq = { ...req, query: { ...req.query, range } };
    const payload = await new Promise((resolve, reject) => {
      getDashboardData(fakeReq, {
        status: () => ({
          json: (body) => (body.success ? resolve(body.data) : reject(new Error(body.message)))
        })
      }).catch(reject);
    });

    const rows = [
      ['Statistique', 'Valeur'],
      ['Chiffre affaires total', payload.stats.revenue.rawValue],
      ['Nombre total de commandes', payload.stats.orders.rawValue],
      ['Nombre total utilisateurs', payload.stats.users.rawValue],
      ['Nombre total produits', payload.stats.products.rawValue]
    ];

    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(';')).join('\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="dashboard-stats-${range}.csv"`);
    res.status(200).send(`\uFEFF${csv}`);
  } catch (error) {
    console.error('Erreur exportDashboardStats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
