export const mustBeAuthenticated = ctx => {
    if (!ctx || !ctx.user) {
        throw new Error('Unauthorized');
    }
};

export const mustBeCurrentUserOrAdmin = (user, ctx) => {
    if (!ctx || !ctx.user || (ctx.user.id !== user.id && !ctx.user.isAdmin)) {
        throw new Error('Unauthorized');
    }
};

export const mustBeAdmin = ctx => {
    if (!ctx || !ctx.user || !ctx.user.isAdmin) {
        throw new Error('Unauthorized');
    }
};
