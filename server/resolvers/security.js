export const mustBeAuthenticated = (ctx, caller) => {
    if (!ctx || !caller) {
        throw new Error('Unauthorized');
    }
};

export const mustBeOwner = (ctx, caller, owner) => {
    if (!ctx || !caller || caller.id !== owner.id) {
        throw new Error('Unauthorized');
    }
};

export const mustBeAdmin = (ctx) => {
    if (!ctx || !ctx.user) {
        throw new Error('Unauthorized');
    }
};

export const mustBeOwnerOrAdmin = (ctx, caller, owner) => {
    if (ctx && ctx.user) {
        return;
    }
    if (!ctx || !caller || caller.id !== owner.id) {
        throw new Error('Unauthorized');
    }
};
