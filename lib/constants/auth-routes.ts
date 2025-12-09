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

type IAuthApi =
  | 'login'
  | 'refreshToken'
  | 'changePassword';

const rawAuthRoutes: Record<IAuthApi, string> = {
  login: '/auth/login',
  refreshToken: '/auth/refreshToken',
  changePassword: '/auth/changePassword',
};

// Create routes with the base path (/api/v1)
export const authRoutes: Record<IAuthApi, string> = RouteHelper.createRoutes(
  URI_BACKEND_SVC_PATH,
  rawAuthRoutes
);
