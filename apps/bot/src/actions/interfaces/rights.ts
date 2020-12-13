import { GROUPS } from "../../contants/groups";
import { MEMBERS } from "../../contants/members";

export type Right = {
    groups: boolean | GROUPS[],
    members: boolean | MEMBERS[],
}