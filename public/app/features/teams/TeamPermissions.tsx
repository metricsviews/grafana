import React from 'react';
import { Permissions } from 'app/core/components/AccessControl';
import { AccessControlAction, Team } from '../../types';
import { contextSrv } from 'app/core/services/context_srv';

type TeamPermissionsProps = {
  team: Team;
};

// TeamPermissions component replaces TeamMember component when the accesscontrol feature flag is set
const TeamPermissions = (props: TeamPermissionsProps) => {
  const canListUsers = contextSrv.hasPermission(AccessControlAction.OrgUsersRead);
  const canSetPermissions = contextSrv.hasPermissionInMetadata(
    AccessControlAction.ActionTeamsPermissionsWrite,
    props.team
  );

  return (
    <Permissions
      resource="teams"
      resourceId={props.team.id}
      canListUsers={canListUsers}
      canSetPermissions={canSetPermissions}
    />
  );
};

export default TeamPermissions;
