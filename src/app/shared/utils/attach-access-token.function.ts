import { HttpRequest } from '@angular/common/http';

export function attachAccessToken(request: HttpRequest<unknown>, token: string) {
    const headers = request.headers.set('Authorization', `Bearer ${token}`);

    return request.clone({ headers });
}
