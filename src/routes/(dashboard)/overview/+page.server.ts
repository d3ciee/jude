export const load = (async (e) => {
    const claims = await e.locals.services.claims.getListOfClaims({
        limit: 10,
        offset: 0
    })

    const auditLogs = await e.locals.services.audit.getListOfLogs({
        limit: 40,
        offset: 0
    })


    return {
        props: {
            claims,
            auditLogs
        }
    };
});