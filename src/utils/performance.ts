import type { PerformanceMetrics } from '../types';

/**
 * Performance monitoring utilities
 */

export interface PerformanceMonitor {
	startOperation(operation: string, inputSize: number): PerformanceTracker;
}

export interface PerformanceTracker {
	readonly operation: string;
	readonly startTime: number;
	end(
		outputSize: number,
		itemCount: number,
		errors: number,
		warnings: number,
	): PerformanceMetrics;
}

/**
 * Create a performance monitor
 */
export function createPerformanceMonitor(): PerformanceMonitor {
	return Object.freeze({
		startOperation(operation: string, inputSize: number): PerformanceTracker {
			const startTime = performance.now();
			const startMemory = process.memoryUsage().heapUsed;
			const startCpu = process.cpuUsage();

			return Object.freeze({
				operation,
				startTime,
				end(
					outputSize: number,
					itemCount: number,
					errors: number,
					warnings: number,
				): PerformanceMetrics {
					const endTime = performance.now();
					const duration = endTime - startTime;
					const memoryUsage = process.memoryUsage().heapUsed - startMemory;
					const cpuUsage = process.cpuUsage(startCpu);
					const totalCpuUsage = cpuUsage.user + cpuUsage.system;

					return Object.freeze({
						operation,
						startTime,
						endTime,
						duration,
						inputSize,
						outputSize,
						itemCount,
						memoryUsage,
						cpuUsage: totalCpuUsage,
						warnings,
						errors,
					});
				},
			});
		},
	});
}

/**
 * Format performance metrics for display
 */
export function formatPerformanceMetrics(metrics: PerformanceMetrics): string {
	const lines = [
		`Operation: ${metrics.operation}`,
		`Duration: ${metrics.duration.toFixed(2)}ms`,
		`Input Size: ${formatBytes(metrics.inputSize)}`,
		`Output Size: ${formatBytes(metrics.outputSize)}`,
		`Items: ${metrics.itemCount}`,
		`Memory: ${formatBytes(metrics.memoryUsage)}`,
		`CPU: ${(metrics.cpuUsage / 1000).toFixed(2)}ms`,
	];

	if (metrics.warnings > 0) {
		lines.push(`Warnings: ${metrics.warnings}`);
	}

	if (metrics.errors > 0) {
		lines.push(`Errors: ${metrics.errors}`);
	}

	return lines.join('\n');
}

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes: number): string {
	if (bytes < 1024) {
		return `${bytes}B`;
	}
	if (bytes < 1024 * 1024) {
		return `${(bytes / 1024).toFixed(2)}KB`;
	}
	if (bytes < 1024 * 1024 * 1024) {
		return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
	}
	return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)}GB`;
}

/**
 * Check if performance metrics exceed thresholds
 */
export function checkPerformanceThresholds(
	metrics: PerformanceMetrics,
	maxDuration: number,
	maxMemory: number,
	maxCpu: number,
): {
	readonly passed: boolean;
	readonly violations: readonly string[];
} {
	const violations: string[] = [];

	if (metrics.duration > maxDuration) {
		violations.push(
			`Duration ${metrics.duration.toFixed(2)}ms exceeds ${maxDuration}ms`,
		);
	}

	if (metrics.memoryUsage > maxMemory) {
		violations.push(
			`Memory ${formatBytes(metrics.memoryUsage)} exceeds ${formatBytes(maxMemory)}`,
		);
	}

	if (metrics.cpuUsage > maxCpu) {
		violations.push(
			`CPU ${(metrics.cpuUsage / 1000).toFixed(2)}ms exceeds ${(maxCpu / 1000).toFixed(2)}ms`,
		);
	}

	return Object.freeze({
		passed: violations.length === 0,
		violations: Object.freeze(violations),
	});
}
