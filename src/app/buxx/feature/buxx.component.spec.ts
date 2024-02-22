import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuxxComponent } from './buxx.component';

describe('BuxxComponent', () => {
  let component: BuxxComponent;
  let fixture: ComponentFixture<BuxxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuxxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BuxxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
