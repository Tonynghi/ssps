/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './features/~__root'
import { Route as IndexImport } from './features/~index'
import { Route as CoursesIndexImport } from './features/~courses/~index'

// Create/Update Routes

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const CoursesIndexRoute = CoursesIndexImport.update({
  id: '/courses/',
  path: '/courses/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/courses/': {
      id: '/courses/'
      path: '/courses'
      fullPath: '/courses'
      preLoaderRoute: typeof CoursesIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/courses': typeof CoursesIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/courses': typeof CoursesIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/courses/': typeof CoursesIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/courses'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/courses'
  id: '__root__' | '/' | '/courses/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  CoursesIndexRoute: typeof CoursesIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  CoursesIndexRoute: CoursesIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "~__root.tsx",
      "children": [
        "/",
        "/courses/"
      ]
    },
    "/": {
      "filePath": "~index.tsx"
    },
    "/courses/": {
      "filePath": "~courses/~index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */