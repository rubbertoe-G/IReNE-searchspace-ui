import { base64PDF } from './fake-data/samplePdf';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { CollaboratorRequest } from '../models/searchspace.model';
import { DocumentMetadata } from '../models/searchspace.model';
import { Map } from '../models/searchspace.model';
import { XY } from '../models/searchspace.model';
import { Timeline } from '../models/searchspace.model';

const collaborators: CollaboratorRequest[] = [
  {id: 'aq9zI01ORNE9Okyziblp', first_name: 'Roberto', last_name: 'Guzman', email: 'roberto.guzman3@upr.edu'},
  {id: '66BuIJ0kNTYPDGz405qb', first_name: 'Yomar', last_name: 'Ruiz', email: 'yomar.ruiz@upr.edu'},
  {id: 'W0SUHONPhPrkrvL3ruxj', first_name: 'Jainel', last_name: 'Torres', email: 'jainel.torrer@upr.edu'},
  {id: 'zOHEzUyIKZB3LsAiu2Kb', first_name: 'Alberto', last_name: 'Canela', email: 'alberto.canela@upr.edu'},
  {id: '9XIu1jT96A5qz1Kpl90R', first_name: 'Alejandro', last_name: 'Vasquez', email: 'alejandro.vasquez@upr.edu'},
  {id: '1XIu1jTk6A5qz1Kplp0R', first_name: 'Don', last_name: 'Quijote', email: 'don.quijote@upr.edu'},
];

const dbDocuments: DocumentMetadata[] = [
    {id: 'tPbl1DyxToy1FUHpfcqn', creator: 'Roberto Guzman', title: 'The great Flooding', published: false, location: 'Caguas', publication_date: '2020-01-02',incident_date:'2017-08-03',modification_date:'2020-03-01',infrastructure_type:['Building'], damage_type:['Flooding'], language:'English', tag:['Flood'] },
    {id: 'iO0PxjKJY0FwezeVq943', creator: 'Yomar Ruiz', title: 'The great Shake', published: true, location: 'Mayagüez', publication_date:'2020-02-01',incident_date:'2017-07-03',modification_date:'2020-03-02',infrastructure_type:['Building'], damage_type:['broken sewer'], language:'Spanish', tag:['Earthquake'] },
    {id: 'qkdQoXSmnNeMISTmMP4f', creator: 'Alberto Canela', title: 'The great Rain', published: false, location: 'Cabo Rojo',publication_date: '2019-10-02', incident_date:'2017-08-13',modification_date:'2020-03-03',infrastructure_type:['Building'], damage_type:['Flooding'], language:'Mandarin', tag:['Flood'] },
    {id: 'RYTSBZAiwlAG0t8EOb6B', creator: 'Alejandro Vasquez', title: 'The great Wind', published: true, location:'San Juan', publication_date: '2020-02-03', incident_date:'2017-07-03',modification_date:'2020-03-05',infrastructure_type:['Building'], damage_type:['Flooding'], language:'English', tag:['Hurricane']  },
    {id: 'VzunBYihBS05mpj0U9pP', creator: 'Jainel Torres', title: 'The great Fire', published: true, location: 'Ponce',publication_date:'2019-02-02',incident_date:'2016-08-03',modification_date:'2019-12-01',infrastructure_type:['Building'], damage_type:['Burn'], language:'Spanish', tag:['Fire']  },
];

const mapDocument: Map[] = [
    {id: 'tPbl1DyxToy1FUHpfcqn', title: 'The great Flooding', location: 'Caguas',infrastructure_type:['Building'], damage_type:['Flooding'], tag:['Flood'] },
    {id: 'iO0PxjKJY0FwezeVq943', title: 'The great Shake', location: 'Mayagüez', infrastructure_type:['Building'], damage_type:['broken sewer'], tag:['Earthquake'] },
    {id: 'qkdQoXSmnNeMISTmMP4f', title: 'The great Rain', location: 'Cabo Rojo',infrastructure_type:['Building'], damage_type:['Flooding'], tag:['Flood'] },
    {id: 'RYTSBZAiwlAG0t8EOb6B', title: 'The great Wind', location:'San Juan', infrastructure_type:['Building'], damage_type:['Flooding'], tag:['Hurricane']  },
    {id: 'VzunBYihBS05mpj0U9pP', title: 'The great Fire', location: 'Ponce', infrastructure_type:['Building'], damage_type:['Burn'], tag:['Fire'] },
];

const xyDocument: XY[] = [
    {id: 'tPbl1DyxToy1FUHpfcqn', title: 'The great Flooding', publication_date: '2020-01-02',incident_date:'2017-08-03',infrastructure_type:['Building'], damage_type:['Flooding'], tag:['Flood'] },
    {id: 'iO0PxjKJY0FwezeVq943', title: 'The great Shake',  publication_date:'2020-02-01',incident_date:'2017-07-03',infrastructure_type:['Building'], damage_type:['broken sewer'],tag:['Earthquake'] },
    {id: 'qkdQoXSmnNeMISTmMP4f', title: 'The great Rain', publication_date: '2019-10-02', incident_date:'2017-08-13',infrastructure_type:['Building'], damage_type:['Flooding'], tag:['Flood'] },
    {id: 'RYTSBZAiwlAG0t8EOb6B', title: 'The great Wind', publication_date: '2020-02-03', incident_date:'2017-07-03',infrastructure_type:['Building'], damage_type:['Flooding'], tag:['Hurricane']  },
    {id: 'VzunBYihBS05mpj0U9pP', title: 'The great Fire', publication_date:'2019-02-02',incident_date:'2016-08-03',infrastructure_type:['Building'], damage_type:['Burn'], tag:['Fire']  },
];

const timelineDocument: Timeline[] = [
    {id: 'tPbl1DyxToy1FUHpfcqn', title: 'The great Flooding', timeline: [{event:'it flooded', eventDate:'2017-07-09'}] },
    {id: 'iO0PxjKJY0FwezeVq943', title: 'The great Shake', timeline: [{event:'the ground shake', eventDate:'2016-01-09'}]  },
    {id: 'qkdQoXSmnNeMISTmMP4f', title: 'The great Rain', timeline: [{event:'it rained', eventDate:'2017-09-09'}]  },
    {id: 'RYTSBZAiwlAG0t8EOb6B', title: 'The great Wind', timeline: [{event:'it rained with wind', eventDate:'2017-07-10'}]   },
    {id: 'VzunBYihBS05mpj0U9pP', title: 'The great Fire', timeline: [{event:'it burned a lot', eventDate:'2018-07-09'}]},
];


@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body, params } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/collab-request') && method === 'POST':
                    return collabRequest();
                case url.endsWith('/api/documents') && method === 'POST':
                    return getDocuments();
                case url.endsWith('/api/documents/{doc_id}') && method === 'GET':
                    return getDocument();      
                case url.endsWith('/documents/visualize/map') && method === 'POST':
                    return docMap();
                case url.endsWith('/documents/visualize/comparison-graph') && method === 'POST':
                    return docXY();
                case url.endsWith('/documents/visualize/timeline') && method === 'POST':
                    return docTimeline();
                default:
                    return next.handle(request);
            }
        }

        // Collaborators
        function collabRequest() {
            console.log(collaborators);
            return ok(collaborators);
        }
        //documents
        function getDocuments() {
            console.log(dbDocuments);
            return ok(dbDocuments);
        }
        function getDocument() {
            return ok(base64PDF);
        }

        function docMap() {
          const {filter} = body;
          for (let index = 0; index < mapDocument.length; index++) {
            const element = mapDocument[index];
            if(element.damage_type.includes(filter)){
                console.log(filter);
                return ok(filter);
            }
            else if(element.infrastructure_type.includes(filter)){
                console.log(filter);
                return ok(filter);
            }
            else if(element.location === filter){
                console.log(filter);
                return ok(filter)
            }
            else if(element.tag.includes(filter)){
                console.log(filter);
                return ok(filter)
            }
          }
        }

        function docXY() {
            const {filter} = body;
            for (let index = 0; index < xyDocument.length; index++) {
              const element = xyDocument[index];
              if(element.damage_type.includes(filter)){
                  console.log(filter);
                  return ok(filter);
              }
              else if(element.incident_date == filter){
                  console.log(filter);
                  return ok(filter);
              }
              else if(element.infrastructure_type.includes(filter)){
                  console.log(filter);
                  return ok(filter);
              }
              else if(element.publication_date == filter){
                  console.log(filter);
                  return ok(filter)
              }
              else if(element.tag.includes(filter)){
                  console.log(filter);
                  return ok(filter)
              }
            }
          }

        function docTimeline() {
            const {filter} = body;
            for (let index = 0; index < timelineDocument.length; index++) {
              const element = timelineDocument[index];
              if(element.title.includes(filter)){
                  console.log(filter);
                  return ok(filter);
              }
            }
          }  

        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function error(message) {
            return throwError({ error: { message } });
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};