exports.errorManagement = (res, status, message) => {
    res.status(status).json({ message });
}