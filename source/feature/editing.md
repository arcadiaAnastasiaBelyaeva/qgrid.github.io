---
title: Editing
group: Features
order: 11
---

There are situations when the end user need to edit data, in this case just setup edit mode equals to `cell` to turn on editing.

```typescript
@Component({
   selector: 'my-component',
   template: `
      <q-grid [rows]="rows$ | async">
         <q-grid-columns generation="deep"></q-grid-columns>
      </q-grid>
      `
})
export class MyComponent implements AfterViewInit {
   @ViewChild(GridComponent) myGrid: GridComponent;   
   rows$: Observable<[]>;

   constructor(dataService: MyDataService) {
      this.rows$ = dataService.getRows();
   }

   ngAfterViewInit() {
      const { model } = this.myGrid;

      model.edit({
         mode: 'cell',
      });
   }
}
```

{% docEditor "github/qgrid/ng2-example/tree/edit-cell-basic/latest" %}

## How to access edit events in q-grid?

Edit model force to use commands to control editing.

```typescript
ngAfterViewInit() {
   const { model } = this.myGrid;

   model.edit({
      mode: 'cell',
      enter: new Command({
         canExecute: e => e.column.type === 'number'
      }),
      commit: new Command({
         execute: e => console.log(e.newValue)
      })
   });
}
```

## How to change edit shortcuts?

Use shortcuts properties from the edit model to change commit or cancel keys.

```typescript
ngAfterViewInit() {
   const { model } = this.myGrid;

   model.edit({
      mode: 'cell',
      commitShortcuts: {
         $default: 'tab|shift+tab|enter|ctrl+s',
         bool: 'tab|shift+tab|left|right|up|down|home|end|pageUp|pageDown'
      }
   });
}
```

## How to enable batch edit?

Use edit `method` property to activate batch editing, it activates cell handler that could be dragged to apply start cell value to the next selection.

```typescript
ngAfterViewInit() {
   const { model } = this.myGrid;

   model.edit({
      mode: 'cell',
      method: 'batch'
   });
}
```

{% docEditor "github/qgrid/ng2-example/tree/edit-cell-batch/latest" %}

## How to reset edit mode?

Just set edit mode equals to `null`.

```typescript
ngAfterViewInit() {
   const { model } = this.myGrid;

   model.edit({
      mode: null
   });
}
```

## How to disable edit mode for the particular column?

Use `canEdit` attribute to not allow editing of the column.

```html
<q-grid [rows]="rows$ | async">
   <q-grid-columns generation="deep">
      <q-grid-column type="text" 
                     key="guid" 
                     [canEdit]="false">
      </q-grid-column>
   </q-grid-columns>
</q-grid>
```

## How to add a new row to the end?

Use data model and focus service.

```typescript
@Component({
   selector: 'my-component',
   template: `
      <q-grid [rows]="rows$ | async">
         <q-grid-columns generation="deep"></q-grid-columns>         

         <q-grid-actions>
            <q-grid-action id="addRow"
                           title="Add Row"
                           icon="add"
                           [command]="addRow">
            </q-grid-action>
         </q-grid-actions>
      </q-grid>
   `
})
export class MyComponent implements AfterViewInit {
   @ViewChild(GridComponent) myGrid: GridComponent;   
   rows$: Observable<[]>;

   addRow = new Command({
      execute: () => {
         const { model } = this.myGrid;

         const atom = new Atom();
         const rows = Array.from(model.data().rows).concat([atom]);
         model.data({ rows });

         const service = this.qgrid.service(model);
         service.focus(rows.length - 1);
      }
   });

   constructor(dataService: MyDataService) {
      this.rows$ = dataService.getRows();
   }
}
```

## How to add delete button and implement row deletion?

Use data model.

```typescript
@Component({
   selector: 'my-component',
   template: `
      <q-grid [rows]="rows$ | async">
         <q-grid-columns generation="deep">
            <q-grid-column type="row-options"
                           key="rowOptions"					         
                           [canEdit]="false">
               <ng-template for="body"
                           let-$cell>
                  <button (click)="deleteRow.execute($cell.row)">
                     DELETE
                  </button>
               </ng-template>
            </q-grid-column>
         </q-grid-columns>         
      </q-grid>
   `
})
export class MyComponent implements AfterViewInit {
   @ViewChild(GridComponent) myGrid: GridComponent;   
   rows$: Observable<[]>;

   deleteRow = new Command({
      execute: (row: Human) => {
         const { model } = this.grid;

         const rows = model.data().rows.filter(x => x !== row);
         model.data({ rows });
      }
   });

   constructor(dataService: MyDataService) {
      this.rows$ = dataService.getRows();
   }
}
```

## How to detect if any data was changed by user input?

Use `commit` command to track if any data was changed by user input.

```typescript
ngAfterViewInit() {
   const { model } = this.myGrid;

   model.edit({
      commit: new Command({
         execute: e => console.log(e.newValue)
      })
   });
}
```

## Suggested Links

* [Data manipulation plugin](/plugin/data-manipulation.md)