const STATUS = {
    PENDING: 'PENDING',
    INPROGRESS: 'INPROGRESS',
    COMPLETED: 'COMPLETED'
}

const ROLES = {
    USER: 'USER',
    ADMIN: 'ADMIN'
}

const SALT_LENGTH = 10

const TOKEN_TYPES = {
    ACCESS: 'access',
    REFRESH: 'refresh',
}

const JWT = {
    ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    ACCESS_EXPIRY: '1h',
    REFRESH_EXPIRY: '7d',
}

module.exports = {
    STATUS,
    ROLES,
    SALT_LENGTH,
    TOKEN_TYPES,
    JWT
}