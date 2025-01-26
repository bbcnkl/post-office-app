import { Routes } from '@angular/router';
import { PostOfficeComponent } from './components/post-office/post-office.component';
import { ShipmentComponent } from './components/shipment/shipment.component';
import { postOfficeResolver } from './components/post-office/post-office.resolver';

export const routes: Routes = [
  {
    path: '',
    component: ShipmentComponent
  },
  {
    path: 'post-offices',
    component: PostOfficeComponent
  },
  {
    path: 'shipments',
    component: ShipmentComponent,
    resolve: {
      postOffices: postOfficeResolver
    }
  },
  {
    path: '**',
    redirectTo: '/'
  }
];
