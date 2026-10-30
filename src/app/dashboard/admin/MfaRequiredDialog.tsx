'use client';

import Link from 'next/link';
import { useState } from 'react';
import Button from '@/components/atoms/Button';
import { DialogClose } from '@/components/atoms/dialog/DialogClose';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/atoms/dialog';

const MfaRequiredDialog = () => {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Multi Factor Authentication Is Required</DialogTitle>
					<DialogDescription>
						As you are logged in as an Admin, you are required to configure multi-factor authentication.
					</DialogDescription>
				</DialogHeader>
				<div className="col gap-2">
					<p className="font-bold">
						<Link className="underline" href="/dashboard/admin/settings">
							Click Here
						</Link>
						&nbsp;to setup MFA
					</p>
					<p>You will receive errors on the site and retrieve no data until, MFA is configured.</p>
				</div>
				<DialogFooter className="sm:justify-start">
					<DialogClose asChild>
						<Button palette="blackOnWhite" type="button">
							Close
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default MfaRequiredDialog;
