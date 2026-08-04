import { ParserPlugin, TemplatePlugin, ExporterPlugin, AIProviderPlugin, PluginManifest } from '../../types/plugin';

class PluginRegistry {
  private parsers: Map<string, ParserPlugin> = new Map();
  private templates: Map<string, TemplatePlugin> = new Map();
  private exporters: Map<string, ExporterPlugin> = new Map();
  private aiProviders: Map<string, AIProviderPlugin> = new Map();

  registerParser(plugin: ParserPlugin) {
    this.parsers.set(plugin.id, plugin);
  }

  registerTemplate(plugin: TemplatePlugin) {
    this.templates.set(plugin.id, plugin);
  }

  registerExporter(plugin: ExporterPlugin) {
    this.exporters.set(plugin.id, plugin);
  }

  registerAIProvider(plugin: AIProviderPlugin) {
    this.aiProviders.set(plugin.id, plugin);
  }

  getParserForExtension(extension: string): ParserPlugin | undefined {
    const ext = extension.toLowerCase().replace('.', '');
    for (const parser of this.parsers.values()) {
      if (parser.fileExtensions.includes(ext)) {
        return parser;
      }
    }
    return undefined;
  }

  getAllTemplates(): TemplatePlugin[] {
    return Array.from(this.templates.values());
  }

  getTemplate(id: string): TemplatePlugin | undefined {
    return this.templates.get(id);
  }

  getAllExporters(): ExporterPlugin[] {
    return Array.from(this.exporters.values());
  }

  getExporter(id: string): ExporterPlugin | undefined {
    return this.exporters.get(id);
  }

  getAllPlugins(): PluginManifest[] {
    return [
      ...Array.from(this.parsers.values()),
      ...Array.from(this.templates.values()),
      ...Array.from(this.exporters.values()),
      ...Array.from(this.aiProviders.values()),
    ];
  }
}

export const pluginRegistry = new PluginRegistry();
