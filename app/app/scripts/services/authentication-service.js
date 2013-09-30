angular.module('cupcakeDashboard')
  .service('AuthenticationService', function AuthenticationService($http, $rootScope) {

    var self = this;
    self.user = null;
    self.contributorLevel = 2;
    self.adminLevel = 3;
    $rootScope.loggedInUser = null;

    this.authenticate = function(next){

      $rootScope.$watch('loggedInUser', function(){
        if($rootScope.loggedInUser != null && !$rootScope.loggedInUser.authLevel)
        {
          self.getUser();
        }
        else
        {
          self.user = $rootScope.loggedInUser;
        }
      });

      self.getUser();

      if(next){
        next();
      }
    }

    this.getUser = function() {
      $http.get('/getUser').then(function(res){
        if(res.data.email){
          $rootScope.loggedInUser = res.data;
          self.user = res.data;

          if(!self.user.first_name || !self.user.last_name)
          {
            _.defer(function(){
              $('.profileLink').tooltip({
                title: 'Complete your profile!',
                placement: 'bottom'
              })
              .tooltip('show');
            });
          }
        }
      });
    }

    this.canViewLevel = function(level){
      if(self.authLevel() >= level)
      {
        return true;
      }
      else
      {
        return false;
      }
    }

    this.loggedInUser = function(){
      return self.user;
    }

    this.authLevel = function(){
      if(self.user != null)
      {
        return self.user.authLevel;
      }
      else
      {
        return 0;
      }
    }

    this.isAdmin = function(){
      return (self.authLevel() >= self.adminLevel);
    }

    this.canAdd = function(){
      return self.authLevel() >= self.contributorLevel;
    }

    this.canEdit = function(model){
      if(self.user != null && model.owner != null && model.owner.email == self.user.email){
        return true;
      }
      else if (self.authLevel() >= self.adminLevel)
      {
        return true;
      }
      else if (model.email != null && model.email == self.user.email)
      {
        return true;
      }
      else
      {
        return false;
      }
    }

    this.canDelete = this.canEdit;

    this.getUserType = function(){
      if(self.user == null) return '';

      switch(self.user.authLevel){
        case 2:
          return 'CONTRIBUTOR'
        case 3:
          return 'ADMIN'
        default:
          return ''
      }
    }

    this.getPermissions = function(model){
      if(!model) model = {};

      var perm = {
        edit: self.canEdit(model),
        remove: self.canDelete(model),
        add: self.canAdd(),
        admin: self.isAdmin(),
        userType: self.getUserType()
      };
      return perm;
    }
  });
