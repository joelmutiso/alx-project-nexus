from rest_framework import permissions

class IsEmployerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow Employers to create/edit jobs.
    Candidates and guests can only view (GET).
    """
    def has_permission(self, request, view):
        # Allow GET, HEAD or OPTIONS requests (Read-only)
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to authenticated Employers
        return request.user.is_authenticated and request.user.is_employer

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `employer` attribute.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        # Instance must have an attribute named `employer`.
        return obj.employer == request.user