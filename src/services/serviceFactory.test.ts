import { describe, expect, it, vi, beforeEach } from 'vitest'
import * as vscode from 'vscode'
import { createServices } from './serviceFactory'

// Mock all dependencies
vi.mock('vscode')
vi.mock('../telemetry/telemetry', () => ({
	createTelemetry: vi.fn(() => ({
		event: vi.fn(),
		dispose: vi.fn(),
	})),
}))
vi.mock('../ui/notifier', () => ({
	createNotifier: vi.fn(() => ({
		showInfo: vi.fn(),
		showWarning: vi.fn(),
		showError: vi.fn(),
		showEnhancedError: vi.fn(),
		showErrorSummary: vi.fn(),
		showProgress: vi.fn(),
	})),
}))
vi.mock('../ui/statusBar', () => ({
	createStatusBar: vi.fn(() => ({
		showProgress: vi.fn(),
		hideProgress: vi.fn(),
		dispose: vi.fn(),
	})),
}))
vi.mock('../utils/localization', () => ({
	createLocalizer: vi.fn(() => ({
		localize: vi.fn(),
	})),
}))
vi.mock('../utils/performance', () => ({
	createPerformanceMonitor: vi.fn(() => ({
		startOperation: vi.fn(),
	})),
}))
vi.mock('../utils/errorHandling', () => ({
	createErrorHandler: vi.fn(() => ({
		handle: vi.fn(),
	})),
	createErrorLogger: vi.fn(() => ({
		log: vi.fn(),
	})),
	createErrorNotifier: vi.fn(() => ({
		notify: vi.fn(),
	})),
}))

describe('serviceFactory', () => {
	let mockContext: vscode.ExtensionContext

	beforeEach(() => {
		vi.clearAllMocks()

		mockContext = {
			subscriptions: [],
		} as any

		vi.mocked(vscode.window.createOutputChannel).mockReturnValue({
			appendLine: vi.fn(),
			dispose: vi.fn(),
			show: vi.fn(),
		} as any)
	})

	describe('createServices', () => {
		it('should create all core services', () => {
			const services = createServices(mockContext)

			expect(services).toBeDefined()
			expect(services.telemetry).toBeDefined()
			expect(services.notifier).toBeDefined()
			expect(services.statusBar).toBeDefined()
			expect(services.localizer).toBeDefined()
			expect(services.performanceMonitor).toBeDefined()
			expect(services.errorHandler).toBeDefined()
			expect(Object.isFrozen(services)).toBe(true)
		})

		it('should create output channel', () => {
			const createOutputSpy = vi.mocked(vscode.window.createOutputChannel)

			createServices(mockContext)

			expect(createOutputSpy).toHaveBeenCalledWith('Regex-LE')
		})

		it('should register output channel in subscriptions', () => {
			createServices(mockContext)

			expect(mockContext.subscriptions.length).toBeGreaterThan(0)
		})

		it('should initialize all service factories', async () => {
			const telemetry = await import('../telemetry/telemetry')
			const notifier = await import('../ui/notifier')
			const statusBar = await import('../ui/statusBar')
			const localizer = await import('../utils/localization')
			const performance = await import('../utils/performance')
			const errorHandling = await import('../utils/errorHandling')

			createServices(mockContext)

			expect(vi.mocked(telemetry.createTelemetry)).toHaveBeenCalled()
			expect(vi.mocked(notifier.createNotifier)).toHaveBeenCalled()
			expect(
				vi.mocked(statusBar.createStatusBar),
			).toHaveBeenCalledWith(mockContext)
			expect(vi.mocked(localizer.createLocalizer)).toHaveBeenCalled()
			expect(
				vi.mocked(performance.createPerformanceMonitor),
			).toHaveBeenCalled()
			expect(vi.mocked(errorHandling.createErrorHandler)).toHaveBeenCalled()
		})

		it('should return services with correct structure', () => {
			const services = createServices(mockContext)

			// Verify all services have expected methods
			expect(typeof services.telemetry.event).toBe('function')
			expect(typeof services.notifier.showInfo).toBe('function')
			expect(typeof services.statusBar.showProgress).toBe('function')
			expect(typeof services.localizer.localize).toBe('function')
			expect(
				typeof services.performanceMonitor.startOperation,
			).toBe('function')
			expect(typeof services.errorHandler.handle).toBe('function')
		})

		it('should handle multiple calls independently', () => {
			const services1 = createServices(mockContext)
			const services2 = createServices({
				subscriptions: [],
			} as any)

			// Each call should create independent services
			expect(services1).not.toBe(services2)
		})

		it('should register telemetry and statusBar disposables', () => {
			const initialLength = mockContext.subscriptions.length
			createServices(mockContext)

			// Should add output channel + telemetry + statusBar = at least 3
			expect(mockContext.subscriptions.length).toBeGreaterThanOrEqual(
				initialLength + 3,
			)
		})
	})
})

