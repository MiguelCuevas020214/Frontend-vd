import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AboutContent, SiteContent } from '../../../../../Core/Interfaces/content.interface';
import { ContentService } from '../../../../../Core/Services/content.service';
import { ToastService } from '../../../../../Core/Services/toast.service';
import { getErrorMessage } from '../../../../../Core/Utils/format.utils';
import { AddMoreBtnComponent } from '../../Buttons/add-more-btn/add-more-btn';
import { ButtonComponent } from '../../Buttons/button/button';
import { SaveButtonComponent } from '../../Buttons/save-button/save-button';
import { ImageInputComponent } from '../../Inputs/image-input/image-input';
import { InputFieldComponent } from '../../Inputs/input-field/input-field';
import { ModalComponent } from '../modal/modal';

@Component({
  selector: 'app-about-form-modal',
  standalone: true,
  imports: [
    FormsModule,
    ModalComponent,
    ButtonComponent,
    SaveButtonComponent,
    AddMoreBtnComponent,
    ImageInputComponent,
    InputFieldComponent,
  ],
  templateUrl: './about-form-modal.html',
  styleUrl: './about-form-modal.css',
})
export class AboutFormModalComponent implements OnInit {
  @Input({ required: true }) content!: AboutContent;
  @Output() saved = new EventEmitter<SiteContent>();
  @Output() cancelled = new EventEmitter<void>();
  private readonly contentService = inject(ContentService);
  private readonly toast = inject(ToastService);
  form!: AboutContent;
  readonly saving = signal(false);
  readonly error = signal('');
  teamOpen = false;

  ngOnInit(): void {
    this.form = JSON.parse(JSON.stringify(this.content)) as AboutContent;
  }
  addMember(): void {
    this.form.team.push({ name: '', role: '', image: '' });
  }
  removeMember(index: number): void {
    this.form.team.splice(index, 1);
  }
  save(): void {
    this.error.set('');
    if (!this.form.title.trim() || !this.form.intro.trim() || !this.form.image) {
      this.error.set('Completa el título, la introducción y la imagen principal.');
      return;
    }
    this.saving.set(true);
    this.contentService.update({ about: this.form }).subscribe({
      next: (content) => {
        this.saving.set(false);
        this.toast.success('Sección Nosotros actualizada.');
        this.saved.emit(content);
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.error.set(getErrorMessage(error));
        this.toast.error('No pudimos guardar la sección.');
      },
    });
  }
}
