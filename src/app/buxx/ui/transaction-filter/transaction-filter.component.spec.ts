import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionFilterComponent } from './transaction-filter.component';

describe('TransactionFilterComponent', () => {
  let component: TransactionFilterComponent;
  let fixture: ComponentFixture<TransactionFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
