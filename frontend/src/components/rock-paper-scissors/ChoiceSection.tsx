import {
    FaRegHandRock,
    FaRegHandPaper,
    FaRegHandScissors,
} from "react-icons/fa";
import ChoiceButton from "./ChoiceButton";

export default function ChoiceSection() {
    return (
        <section className="flex gap-6">
            <ChoiceButton
                icon={
                    <FaRegHandRock style={{ width: "64px", height: "64px" }} />
                }
                label="Rock"
            />
            <ChoiceButton
                icon={
                    <FaRegHandPaper style={{ width: "64px", height: "64px" }} />
                }
                label="Paper"
            />
            <ChoiceButton
                icon={
                    <FaRegHandScissors
                        style={{ width: "64px", height: "64px" }}
                    />
                }
                label="Scissors"
            />
        </section>
    );
}
