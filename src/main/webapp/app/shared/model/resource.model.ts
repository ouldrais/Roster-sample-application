export interface IResource {
  id?: number;
  key?: number | null;
  firstName?: string | null;
  lastName?: string | null;
  teamRole?: string | null;
  exchangeAllowed?: boolean | null;
}

export const defaultValue: Readonly<IResource> = {
  exchangeAllowed: false,
};
