import { AggregateRoot as CqrsAggregateRoot } from '@nestjs/cqrs';

export class AggregateRoot extends CqrsAggregateRoot {}

// AggregateRoot is main object that controls a group of related domain objects.
//         Product Aggregate
// ┌──────────────────────┐
// │                      │
// │   Product            │ ← Aggregate Root
// │      │               │
// │      ├── Sku         │
// │      └── Money       │
// │                      │
// └──────────────────────┘
