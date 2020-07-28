import { ActiveModule, ActiveStore, getModule } from '@/lib/ActiveStore';
import { Example, IExample } from '@/model/example';

@ActiveModule(Example, { name: 'ExampleStore' })
export class ExampleStore extends ActiveStore<IExample> {}

export const exampleStore = getModule(ExampleStore);
