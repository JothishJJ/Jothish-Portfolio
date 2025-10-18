export async function shouldAutoResolveDependencies(resource) {
    if (typeof resource.autoResolveDeps === 'boolean') {
        return resource.autoResolveDeps;
    }
    // otherwise hydrate is the default
    return true;
}
