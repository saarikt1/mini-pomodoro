(function(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.MiniPomodoroTime = factory();
  }
}(this, function() {
  function getMostRecentBoundary(now) {
    const today3AM = new Date(now);
    today3AM.setHours(3, 0, 0, 0);
    if (now < today3AM) {
      return new Date(today3AM.getTime() - 24 * 60 * 60 * 1000);
    }
    return today3AM;
  }

  function shouldReset(lastUpdateIso, now) {
    if (!lastUpdateIso) return false;
    const lastUpdate = new Date(lastUpdateIso);
    if (Number.isNaN(lastUpdate.getTime())) return false;
    const boundary = getMostRecentBoundary(now || new Date());
    return lastUpdate < boundary;
  }

  return { getMostRecentBoundary, shouldReset };
}));
