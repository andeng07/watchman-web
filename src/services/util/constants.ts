const LOCAL_IP = window.location.hostname; // Gets the current host's IP or domain
const PORT = 7107;

export const Constants = {
    GRINGOTTS_USER_PHOTOS_URL: `http://${LOCAL_IP}:${PORT}/users`,
    GRINGOTTS_BASE_URL: `http://${LOCAL_IP}:${PORT}/api`
};

console.log(Constants.GRINGOTTS_BASE_URL); // Debug output
