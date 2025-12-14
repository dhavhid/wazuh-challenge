import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '../../../src/core/server';

import { CustomPluginPluginSetup, CustomPluginPluginStart } from './types';
import { defineRoutes } from './routes';
import { TodoService } from './services/todo_service';
import { generateDistributedSampleData } from './sample_data/generate_sample_data';

export class CustomPluginPlugin
  implements Plugin<CustomPluginPluginSetup, CustomPluginPluginStart> {
  private readonly logger: Logger;
  private loadSampleData: boolean;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
    this.loadSampleData = true; // Default value
    // Read configuration for sample data loading (default: true)
    initializerContext.config.createIfExists<any>().subscribe((config) => {
      this.loadSampleData = config?.loadSampleData !== false;
    });
  }

  public setup(core: CoreSetup) {
    this.logger.debug('customPlugin: Setup');
    const router = core.http.createRouter();

    // Register server side APIs
    defineRoutes(router);

    return {};
  }

  public async start(core: CoreStart) {
    this.logger.debug('customPlugin: Started');

    // Load sample data on first startup if enabled
    if (this.loadSampleData) {
      this.initializeSampleData(core).catch((error) => {
        this.logger.error(`Failed to initialize sample data: ${error.message}`);
      });
    }

    return {};
  }

  public stop() {}

  private async initializeSampleData(core: CoreStart) {
    try {
      // Get OpenSearch client
      const client = core.opensearch.legacy.client.asScoped({
        headers: {},
      } as any);

      const todoService = new TodoService(client);

      // Check if sample data already exists
      const hasData = await todoService.hasSampleData();

      if (!hasData) {
        this.logger.info('No existing data found. Loading sample data...');

        // Generate 500 sample todos
        const sampleData = generateDistributedSampleData();

        this.logger.info(`Generated ${sampleData.length} sample TODO items`);

        // Bulk import
        const result = await todoService.bulkImport(sampleData);

        this.logger.info(
          `Sample data loaded successfully: ${result.success} items imported, ${result.failed} failed`
        );

        if (result.failed > 0) {
          this.logger.warn(`${result.failed} items failed to import`);
        }
      } else {
        this.logger.info('Sample data already exists. Skipping import.');
      }
    } catch (error) {
      this.logger.error(`Error during sample data initialization: ${error.message}`);
      throw error;
    }
  }
}
