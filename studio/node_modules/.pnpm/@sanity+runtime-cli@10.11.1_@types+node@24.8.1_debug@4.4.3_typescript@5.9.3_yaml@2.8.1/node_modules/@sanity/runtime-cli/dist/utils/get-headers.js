import pkg from '../../package.json' with { type: 'json' };
const userAgent = `${pkg.name}@${pkg.version}`;
export default function getHeaders({ token, scopeId, scopeType }) {
    return {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'X-Sanity-Scope-Type': scopeType,
        'X-Sanity-Scope-Id': scopeId,
        'User-Agent': userAgent,
    };
}
