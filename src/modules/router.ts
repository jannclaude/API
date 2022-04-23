import { join, relative } from 'path';
import { pathToFileURL } from 'url';
import { Express, Router } from 'express';
import { getFiles } from '../utils/helpers.js';
import { APIRoute } from '../utils/types.js';

export async function loadAPIRoutes(expressClient: Express): Promise<number> {
  let totalRoutes = 0;
  let router = Router();

  const routes_path = join(process.cwd(), 'dist/routes');

  for (const route_path of getFiles(routes_path)) {
    const file_path = pathToFileURL(route_path).href;
    const rel_path = relative(routes_path, route_path);
    const sections = rel_path.replace(/\\/g, '/').split('/');
    const method = sections[sections.length - 1].split('.')[0].toUpperCase();
    const endpoint = `/${sections
      .slice(0, sections.length - 1)
      .map(section => {
        if (!section.startsWith('_')) return section;
        return `:${section.substring(1)}`;
      })
      .join('/')}`;

    const route = (await import(file_path)).default as APIRoute;
    router = route(endpoint, router);

    totalRoutes++;
    console.log(`Route Loaded: ${method} ${endpoint}`);
  }

  expressClient.use(router);

  return totalRoutes;
}
