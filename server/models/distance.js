const EARTH_RADIUS_KM = 6371.0;
const DEG2RAD = Math.PI / 180.0;

// Haversine distance in Km
const calculateDistance = (location1, location2) => {
    if (!location1 || !location2) {
        return -1;
    }

    const lat1 = location1.latitude;
    const lon1 = location1.longitude;
    const lat2 = location2.latitude;
    const lon2 = location2.longitude;

    if (lat1 === null || lat1 === undefined ||
        lon1 === null || lon1 === undefined ||
        lat2 === null || lat2 === undefined ||
        lon2 === null || lon2 === undefined) {
        return -1;
    }

    const dLat = (lat2 - lat1) * DEG2RAD;
    const dLon = (lon2 - lon1) * DEG2RAD;

    const lat1rad = (lat1) * DEG2RAD;
    const lat2rad = (lat2) * DEG2RAD;

    const sinDLat = Math.sin(dLat * 0.5);
    const sinDLon = Math.sin(dLon * 0.5);
    const a = sinDLat * sinDLat + sinDLon * sinDLon * Math.cos(lat1rad) * Math.cos(lat2rad);
    const c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a));

    const dist = Math.abs(EARTH_RADIUS_KM * c);
    return Number.isFinite(dist) ? dist : -1;
};

export { calculateDistance };
