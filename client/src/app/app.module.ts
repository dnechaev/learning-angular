import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { EventsModule } from './events/events.module';
import { PurchasesModule } from './purchases/purchases.module';
import { DashboardModule } from './dashboard/dashboard.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    HttpClientModule,
    SharedModule,
    AuthModule,
    DashboardModule,
    UsersModule,
    EventsModule,
    PurchasesModule,
    AppRoutingModule,
  ],
  bootstrap: [ AppComponent ],
})
export class AppModule {}
