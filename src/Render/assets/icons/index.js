const req = require.context('./svg', false, /\.svg$/)
const requireAll = context => context.keys().map(context)
requireAll(req)