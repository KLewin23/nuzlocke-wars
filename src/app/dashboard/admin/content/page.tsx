// import { Info } from 'lucide-react';
import Title from '@/atoms/typography/Title';
import DashboardNavbar from '@/organisms/DashboardNavbar';

const page = () => (
	<>
		<DashboardNavbar />
		<div className="col w-full max-w-250 grow gap-4 self-center overflow-hidden">
			<div className="col gap-2">
				<Title>IGNORE ME</Title>
				{/* <Title>Manually Approve Clip</Title>
				<div className="row items-center gap-2">
					<Info size={23} />
					<p className="font-bold">Fill a users details, stage them, and once all are staged, submit them.</p>
				</div> */}
			</div>
		</div>
	</>
);

export default page;
