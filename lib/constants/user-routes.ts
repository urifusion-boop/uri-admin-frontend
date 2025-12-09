import { BackendUrlEnum } from './backend-urls';

/**
 * Helper to create routes with base path prefix
 */
class RouteHelper {
  static createRoutes(
    basePath: string,
    routes: Record<string, string>
  ): Record<string, string> {
    const prefixedRoutes: Record<string, string> = {};
    for (const key in routes) {
      prefixedRoutes[key] = `${basePath}${routes[key]}`;
    }
    return prefixedRoutes;
  }
}

const URI_BACKEND_SVC_PATH = BackendUrlEnum.BACKEND;

type IUserApi = 'getByUserId';

const rawUserRoutes: Record<IUserApi, string> = {
  getByUserId: '/users',
};

// Create routes with the base path (/api/v1)
export const userRoutes: Record<IUserApi, string> = RouteHelper.createRoutes(
  URI_BACKEND_SVC_PATH,
  rawUserRoutes
);
