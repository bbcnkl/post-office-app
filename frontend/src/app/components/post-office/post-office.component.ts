import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { PostOffice } from '../../models/post-office.model';
import { PostOfficeDialogComponent } from './post-office-dialog/post-office-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { PostOfficeService } from '../../services/post-office.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PostOfficeDeleteDialogComponent } from './post-office-delete-dialog/post-office-delete-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-post-office',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDividerModule,
    RouterLink,
  ],
  templateUrl: './post-office.component.html',
  styleUrl: './post-office.component.scss',
})
export class PostOfficeComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['location', 'zipCode', 'action'];
  dataSource = new MatTableDataSource<PostOffice>([]);

  readonly dialog = inject(MatDialog);
  readonly snackBar = inject(MatSnackBar);
  readonly postOfficeService = inject(PostOfficeService);
  private destroy$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.loadPostOffices();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async loadPostOffices() {
    try {
      const postOffices = await this.postOfficeService.loadAllPostOffices();
      this.paginator.length = postOffices.total;
      this.dataSource.data = postOffices.list;
    } catch (err) {
      this.snackBar.open('Error loading post offices', '', {
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
      });
    }
  }

  openPostOfficeDialog(isEdit: boolean = false, postOffice?: PostOffice): void {
    const dialogRef = this.dialog.open(PostOfficeDialogComponent, {
      data: {
        _id: postOffice?._id ?? '',
        location: postOffice?.location ?? '',
        zipCode: postOffice?.zipCode ?? '',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result !== undefined) {
          if (isEdit && postOffice?._id) {
            this.updatePostOffice(result, postOffice?._id);
          } else {
            this.createPostOffice(result);
          }
        }
      });
  }

  openDeleteDialog(postOffice: PostOffice): void {
    const dialogRef = this.dialog.open(PostOfficeDeleteDialogComponent, {
      data: postOffice,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result !== undefined) {
          this.deletePostOffice(result._id);
        }
      });
  }

  async createPostOffice(postOffice: PostOffice) {
    try {
      const savedPostOffice = await this.postOfficeService.createPostOffice(
        postOffice
      );
      this.paginator.length += 1;
      this.dataSource.data = [...this.dataSource.data, savedPostOffice];
    } catch (err: any) {
      this.snackBar.open('Error: ' + err?.error?.error, '', {
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
      });
    }
  }

  async updatePostOffice(postOffice: PostOffice, id: string) {
    try {
      const updatedPostOffice = await this.postOfficeService.updatePostOffice(
        postOffice,
        id
      );
      this.dataSource.data = this.dataSource.data.map((po: PostOffice) =>
        po._id === id ? updatedPostOffice : po
      );
    } catch (err: any) {
      this.snackBar.open('Error: ' + err?.error?.error, '', {
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
      });
    }
  }

  async deletePostOffice(id: string) {
    try {
      this.postOfficeService.deletePostOffice(id);
      this.dataSource.data = this.dataSource.data.filter(
        (po: PostOffice) => po._id !== id
      );
      this.paginator.length -= 1;
    } catch (err: any) {
      this.snackBar.open('Error: ' + err?.error?.error, '', {
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
      });
    }
  }
}
