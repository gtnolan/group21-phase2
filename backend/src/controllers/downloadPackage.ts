import { Request, Response } from 'express';
import PackageService from '../services/packageService';
import { readPackageZip } from '../utils/packageFileUtils';

export default async function downloadPackage(req: Request, res: Response) {
  const { IDStr } = req.params;

  if (!IDStr || Number.isNaN(IDStr)) {
    res.status(400).send('Invalid request');
    return;
  }

  const ID = parseInt(IDStr);

  const versionObj = await PackageService.getPackageVersion(ID);
  if (!versionObj) {
    res.status(404).send('Package not found');
    return;
  }

  const packageZip = await readPackageZip(versionObj.packageID, versionObj.ID);
  if (!packageZip) {
    res.status(500).send('Error reading package');
    return;
  }

  res.status(200).send({
    metadata: {
      Name: PackageService.getPackageName(versionObj.packageID),
      Version: versionObj.version,
      ID: IDStr,
    },
    data: {
      Content: packageZip,
      JSProgram: "", // TODO: Implement
    }
  });
}