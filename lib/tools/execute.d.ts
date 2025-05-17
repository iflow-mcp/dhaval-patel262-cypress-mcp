/**
 * Copyright (c) 2024
 *
 * Licensed under the MIT License
 */
import type { Context } from '../context.js';
import type { Tool } from './tool.js';
/**
 * Execute test tools
 * @param context Context instance
 * @returns Array of tools
 */
export default function executeTools(context: Context): Tool<any>[];
