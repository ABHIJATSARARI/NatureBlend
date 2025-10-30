import { registerRootComponent } from 'expo';
import AppNavigator from './src/navigation/AppNavigator';

// Using the actual AppNavigator instead of the template
export function App() {
  return <AppNavigator />;
}

registerRootComponent(App);
