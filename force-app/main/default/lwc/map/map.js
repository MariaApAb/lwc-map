import { LightningElement, api, track, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

export default class Map extends LightningElement {
    //ShippingStreet, ShippingCity, ShippingState, ShippingPostalCode, ShippingCountry, ShippingLatitude, ShippingLongitude, ShippingGeocodeAccuracy, ShippingAddress
    @api recordId;
    @api objectApiName;
    @api streetApiName;
    @api cityApiName;
    @api stateApiName;
    @api postalCodeApiName;
    @api countryApiName;
    @api latitudeApiName;
    @api longitudeApiName;

    @track record;

    _fields = [];
    _error;

    // MAP
    mapOptions = {
        'disableDefaultUI': true, // when true disables Map|Satellite, +|- zoom buttons
        'draggable': false, // when false prevents panning by dragging on the map
        'zoomControl': true,
        'scrollwheel': false,
        'disableDoubleClickZoom': false
    };
    mapMarkers;
    zoomLevel = 15;

    connectedCallback() {
		this._fields = [
            this.objectApiName + '.' + this.streetApiName,
            this.objectApiName + '.' + this.cityApiName,
            this.objectApiName + '.' + this.stateApiName,
            this.objectApiName + '.' + this.postalCodeApiName,
            this.objectApiName + '.' + this.countryApiName
        ];
	}

	/*@wire(getRecord, { recordId: '$recordId', fields: '$_fields' })
    record;*/

    @wire(getRecord, { recordId: '$recordId', fields: '$_fields' })
    wiredRecord({ error, data }) {
        if (data) {
            this.record = data;
            this.mapMarkers = [
                {
                    location: {
                        Street: data.fields[this.streetApiName].value,
                        City: data.fields[this.cityApiName].value,
                        State: data.fields[this.stateApiName].value,
                        PostalCode: data.fields[this.postalCodeApiName].value,
                        Country: data.fields[this.countryApiName].value
                    },
                    mapIcon : {
                        path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
                        fillColor: '#CF3476',
                        fillOpacity: .5,
                        strokeWeight: 1,
                        scale: .10,
                    }
                }
            ];
        } else if (error) {
            let message = 'Unknown error';
            if (Array.isArray(error.body)) {
                message = error.body.map(e => e.message).join(', ');
            } else if (typeof error.body.message === 'string') {
                message = error.body.message;
            }
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error loading contact',
                    message,
                    variant: 'error',
                }),
            );
        }
    }
    
}