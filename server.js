/* eslint-disable import/no-extraneous-dependencies */
import * as build from "@remix-run/dev/server-build";
import { createRequestHandler } from "@remix-run/vercel";

export default createRequestHandler({ build, mode: process.env.NODE_ENV });
