export function userHasArea(user: any, requiredRoles: number[]): boolean {
    if (!user || !user.area_roles) return false;

    const userRoles = user.area_roles.map((ar: any) => ar.role_id);
    return requiredRoles.some(role => userRoles.includes(role));
}
