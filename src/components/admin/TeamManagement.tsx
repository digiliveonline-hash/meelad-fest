type TeamManagementProps = {
  children: React.ReactNode;
};

function TeamManagement({ children }: TeamManagementProps) {
  return (
    <div className="mt-10 border-t pt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">
          🏆 Team Management
        </h2>
      </div>

      {children}
    </div>
  );
}

export default TeamManagement;