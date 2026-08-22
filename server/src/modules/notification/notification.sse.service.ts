import { Injectable } from "@nestjs/common";
import { Subject, Observable, interval, merge } from "rxjs";
import { map } from "rxjs/operators";

export type SseNotificationEvent = { data: string };

@Injectable()
export class NotificationSseService {
  private readonly subjects = new Map<string, Subject<SseNotificationEvent>>();

  /** Returns a shared Observable for the user's SSE stream + 25-second keepalive pings. */
  getStream(userId: string): Observable<SseNotificationEvent> {
    if (!this.subjects.has(userId)) {
      this.subjects.set(userId, new Subject<SseNotificationEvent>());
    }

    const keepAlive$ = interval(25_000).pipe(
      map(() => ({ data: "ping" })),
    );

    return merge(this.subjects.get(userId)!.asObservable(), keepAlive$);
  }

  /** Emits a notification event to all active connections for a given user. */
  emit(userId: string, payload: object) {
    this.subjects.get(userId)?.next({ data: JSON.stringify(payload) });
  }
}
