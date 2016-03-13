angular.module('app', [])
.factory('dataManager', function($http){
    var factory = {};

    factory.addColumnsToTable = function(req){
        return $http.post('http://www.mapquestapi.com/datamanager/v2/add-columns?key=j0sptDnFXIijUg7JZ3r0Rr6fJUuuoAVa&inFormat=json&outFormat=json', req);
    };

    factory.copyTable = function(req){
        return $http.post('http://www.mapquestapi.com/datamanager/v2/copy-table?key=j0sptDnFXIijUg7JZ3r0Rr6fJUuuoAVa&inFormat=json', req);
    };

    factory.createTable = function(req){
        return $http.post('http://www.mapquestapi.com/datamanager/v2/create-table?key=j0sptDnFXIijUg7JZ3r0Rr6fJUuuoAVa&inFormat=json', req);
    };

    factory.dropColumnsFromTable = function(req){
        return $http.post('http://www.mapquestapi.com/datamanager/v2/drop-columns?key=j0sptDnFXIijUg7JZ3r0Rr6fJUuuoAVa&inFormat=json', req);
    };

    factory.dropColumnsFromTable = function(req){
        return $http.post('http://www.mapquestapi.com/datamanager/v2/drop-columns?key=j0sptDnFXIijUg7JZ3r0Rr6fJUuuoAVa&inFormat=json', req);
    };

    factory.dropTable = function(req){
        return $http.post('http://www.mapquestapi.com/datamanager/v2/drop-table?key=j0sptDnFXIijUg7JZ3r0Rr6fJUuuoAVa&inFormat=json', req);
    };

    factory.editColumnNamesInTable = function(req){
        return $http.post('http://www.mapquestapi.com/datamanager/v2/edit-column-names?key=j0sptDnFXIijUg7JZ3r0Rr6fJUuuoAVa&inFormat=json', req);
    };

    factory.editTableName = function(req){
        return $http.post('http://www.mapquestapi.com/datamanager/v2/edit-table-names?key=j0sptDnFXIijUg7JZ3r0Rr6fJUuuoAVa&inFormat=json', req);
    };

    factory.editTablePermissions = function(req){
        return $http.post('http://www.mapquestapi.com/datamanager/v2/edit-table-permissions?key=j0sptDnFXIijUg7JZ3r0Rr6fJUuuoAVa&inFormat=json', req);
    };

    factory.getColumnTypes = function(){
        return $http.get('http://www.mapquestapi.com/datamanager/v2/get-column-types?key=j0sptDnFXIijUg7JZ3r0Rr6fJUuuoAVa');
    };

    factory.getTablePermissions = function(req){
        return $http.post('http://www.mapquestapi.com/datamanager/v2/get-table-permissions?key=j0sptDnFXIijUg7JZ3r0Rr6fJUuuoAVa&inFormat=json', req);
    };

    factory.getTables = function(req){
        return $http.post('http://www.mapquestapi.com/datamanager/v2/get-tables?key=j0sptDnFXIijUg7JZ3r0Rr6fJUuuoAVa&inFormat=json&outFormat=json', req);
    };

    factory.viewTableData = function(req){
        return $http.post('http://www.mapquestapi.com/datamanager/v2/get-table-data?key=j0sptDnFXIijUg7JZ3r0Rr6fJUuuoAVa&inFormat=json', req);
    };

    factory.deleteTableData = function(req){
        return $http.post('http://www.mapquestapi.com/datamanager/v2/delete-data?key=j0sptDnFXIijUg7JZ3r0Rr6fJUuuoAVa&inFormat=json', req);
    };

    factory.viewTableData = function(req){
        return $http.post('http://www.mapquestapi.com/datamanager/v2/get-table-data?key=j0sptDnFXIijUg7JZ3r0Rr6fJUuuoAVa&inFormat=json', req);
    };

    factory.updateTableData = function(req){
        return $http.post('http://www.mapquestapi.com/datamanager/v2/update-data?key=j0sptDnFXIijUg7JZ3r0Rr6fJUuuoAVa&inFormat=json', req);
    };

    factory.updateTableData = function(req){
        return $http.post('http://www.mapquestapi.com/datamanager/v2/update-data?key=j0sptDnFXIijUg7JZ3r0Rr6fJUuuoAVa&inFormat=json', req);
    };

    factory.uploadTableData = function(req){
        return $http.post('http://www.mapquestapi.com/datamanager/v2/upload-data?key=j0sptDnFXIijUg7JZ3r0Rr6fJUuuoAVa&inFormat=json', req);
    };

    return factory; 
    
});