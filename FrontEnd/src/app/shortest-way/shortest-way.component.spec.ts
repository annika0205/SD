import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortestWayComponent } from './shortest-way.component';

describe('ShortestWayComponent', () => {
  let component: ShortestWayComponent;
  let fixture: ComponentFixture<ShortestWayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShortestWayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShortestWayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
