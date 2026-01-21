// React Hook
export const usePerformanceMonitor = (componentName: string) => {
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name.includes(componentName)) {
          console.log(`${componentName} render time:`, entry.duration);
        }
      });
    });
    
    observer.observe({ entryTypes: ['measure'] });
    
    return () => observer.disconnect();
  }, [componentName]);
};

// Angular Service
@Injectable({ providedIn: 'root' })
export class PerformanceMonitorService {
  private observers = new Map<string, PerformanceObserver>();

  startMonitoring(componentName: string): void {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.log(`${componentName} performance:`, entry);
      });
    });
    
    observer.observe({ entryTypes: ['measure', 'navigation'] });
    this.observers.set(componentName, observer);
  }

  stopMonitoring(componentName: string): void {
    const observer = this.observers.get(componentName);
    if (observer) {
      observer.disconnect();
      this.observers.delete(componentName);
    }
  }
}
