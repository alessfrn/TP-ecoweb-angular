import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject, HostListener,
} from '@angular/core';
import { provideComponentStore } from '@ngrx/component-store';
import { DEFAULT_LIMIT } from '../shared/constants';
import { AuthStore } from '../shared/store';
import { ArticleListComponent } from '../shared/ui/article-list';
import { PaginationComponent } from '../shared/ui/pagination';
import { FEED_TYPE, FeedType, HomeStore } from './home.store';
import { FeedToggleComponent } from './ui/feed-toggle/feed-toggle.component';
import { TagsComponent } from './ui/tags/tags.component';
import { Article } from '../shared/models';
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'app-home',
    imports: [
        TagsComponent,
        FeedToggleComponent,
        NgIf,
        ArticleListComponent,
        PaginationComponent,
    ],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideComponentStore(HomeStore)]
})
export default class HomeComponent implements OnInit {
  readonly #homeStore = inject(HomeStore);
  readonly #authStore = inject(AuthStore);
  readonly articleCount = this.#homeStore.selectors.articleCount;
  readonly currentOffset = this.#homeStore.selectors.currentOffset;
  readonly isAuthenticated = this.#authStore.selectors.isAuthenticated;
  readonly articleList = this.#homeStore.selectors.articleList;

  constructor(private http: HttpClient) {
  }

  spamNetwork() {
    for (let i = 0; i < 1000; i++) {
      const cacheBuster = `?cb=${Date.now()}-${Math.random()}`;

      this.http.get(`https://jsonplaceholder.typicode.com/todos/1${cacheBuster}`).subscribe({
        next: () => console.log(`Requête ${i} réussie`),
        error: (err) => console.error(`Erreur sur la requête ${i}`, err)
      });
    }
  }

  ngOnInit(): void {
    if (this.isAuthenticated()) {
      this.toggleFeed(FEED_TYPE.yourFeed);
    } else {
      this.toggleFeed(FEED_TYPE.globalFeed);
    }
    this.spamNetwork();
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    $event.returnValue = true;
  }
  canDeactivate(): boolean {
    return window.confirm('Voulez-vous vraiment quitter cette magnifique page ?');
  }

  selectTag(tag: string): void {
    this.#homeStore.queryArticle({
      feedType: FEED_TYPE.tagFeed,
      params: {
        limit: DEFAULT_LIMIT,
        offset: 0,
        tag,
      },
    });
  }

  toggleFeed(feedType: FeedType): void {
    this.#homeStore.queryArticle({
      feedType,
      params: {
        limit: DEFAULT_LIMIT,
        offset: 0,
      },
    });
  }

  onPageOffsetChange(offset: number): void {
    this.#homeStore.onOffsetChange(offset);
  }

  toggleFavorite(article: Article): void {
    this.#homeStore.toggleFavorite(article);
  }
}
