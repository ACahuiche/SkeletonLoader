import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FetchdataService } from './fetchdata.service';
import { Subject, finalize, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgxSkeletonLoaderModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [FetchdataService]
})
export class AppComponent implements OnInit, OnDestroy {
  
  title = 'Prueba de Skeleton Loading';
  public fetchedApiData: any[] = [];
  public isLoading:boolean = true;
  private unsuscribe$ = new Subject();

  constructor(private fetch: FetchdataService){}

  ngOnInit(): void {
    setTimeout(() =>{
      this.getDetails()
    }, 4000);
  }

  private getDetails() {
    this.fetch.getData().pipe(
      tap({
        next: (fetchedData) =>{
          if(fetchedData) {
            this.fetchedApiData = fetchedData;
          }
        },
        error: (error) =>{
          alert(error);
        }
      }),
      finalize(() => {
        this.isLoading = false;
      }),
      takeUntil(this.unsuscribe$)
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.unsuscribe$.next(true);
    this.unsuscribe$.complete();
  }
}
